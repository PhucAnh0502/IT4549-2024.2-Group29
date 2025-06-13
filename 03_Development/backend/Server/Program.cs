using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Server.Data;
using Server.Services;
using Server.Interfaces.IServices;
using Server.Utils;
using System.Text;
using Server.Middlewares;
using Server.Models.User;
using Microsoft.AspNetCore.Mvc;
using Server.Enums.ErrorCodes;
using Server.Interfaces.IUltilities;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new ArgumentNullException("JwtSettings:Key", "JWT key cannot be null."));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = null;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5, // Tùy chỉnh số lần thử lại tối đa nếu cần, ví dụ 5 lần
                maxRetryDelay: TimeSpan.FromSeconds(30), // Tùy chỉnh độ trễ tối đa giữa các lần thử lại
                errorNumbersToAdd: null); // Giữ null để sử dụng các mã lỗi tạm thời mặc định
        }));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBcryptService, BcryptService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ITrainingRecordService, TrainingRecordService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IActivationService, ActivationService>();
builder.Services.AddScoped<IPasswordService,PasswordService>();
builder.Services.AddSingleton<IJwtUtils, JwtUtils>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    return new JwtUtils(configuration);
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errorId = Guid.NewGuid();
        var traceId = context.HttpContext.TraceIdentifier;

        var message = string.Join("\n", context.ModelState
            .Where(kvp => kvp.Value?.Errors.Count > 0)
            .SelectMany(kvp => kvp.Value!.Errors.Select(err => $"{kvp.Key}: {err.ErrorMessage}")));

        var response = new
        {
            Id = errorId,
            TraceId = traceId,
            StatusCode = 400,
            ErrorCode = (int)AuthErrorCode.InvalidModel,
            Message = message
        };

        var result = new BadRequestObjectResult(response);
        result.ContentTypes.Add("application/json");
        return result;
    };
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Server", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token vào ô bên dưới. Format: Bearer <your_token>"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                },
                Scheme = "oauth2",
                Name = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

// Cấu hình Authentication và JWT
builder.Services
    .AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateAudience = true,
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ExceptionHandlerMiddleware>();


//app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.UseAuthentication();

app.UseAuthorization();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DatabaseContext>();

    // Tự động chạy migration
    context.Database.Migrate();

    // Kiểm tra và seed data nếu database rỗng
    if (!context.Accounts.Any())
    {
        var (accountSeed, userSeed) = SeedData.GetAccountAndUserSeedData();

        context.Accounts.AddRange(accountSeed);

        context.Admins.AddRange(userSeed.OfType<AdminModel>());
        context.Managers.AddRange(userSeed.OfType<ManagerModel>());
        context.Trainers.AddRange(userSeed.OfType<TrainerModel>());
        context.Members.AddRange(userSeed.OfType<MemberModel>());

        Console.WriteLine("Database seeded accounts successfully!");
    }
    if (!context.Rooms.Any())
    {
        var seedRooms = SeedData.GetRoomSeedData();
        context.Rooms.AddRange(seedRooms);
        context.SaveChanges();
        Console.WriteLine("Database seeded rooms successfully!");
    }
    if (!context.Devices.Any())
    {
        var seedDevices = await SeedData.GetDeviceSeedData(context);
        context.Devices.AddRange(seedDevices);
        context.SaveChanges();
        Console.WriteLine("Database seeded devices successfully!");
    }
    if (!context.Courses.Any())
    {
        var seedCourses = await SeedData.GetCourseSeedData(context);
        context.Courses.AddRange(seedCourses);
        context.SaveChanges();
        Console.WriteLine("Database seeded courses successfully!");
    }
    else
    {
        Console.WriteLine("Database is already seeded!");
    }
}

app.MapControllers();

var url = "http://localhost:8089/swagger/index.html";
Console.WriteLine($"Web run at: {url}");

await app.RunAsync();