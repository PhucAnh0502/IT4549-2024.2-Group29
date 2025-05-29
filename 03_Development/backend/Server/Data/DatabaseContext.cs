using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Models.Account;
using Server.Models.Booking;
using Server.Models.Course;
using Server.Models.Device;
using Server.Models.Report;
using Server.Models.Room;
using Server.Models.TrainingRecord;
using Server.Models.User;

namespace Server.Data
{
    public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
    {

        // DbSet for Account
        public DbSet<AccountModel> Accounts { get; set; }
        public DbSet<ActivationCodeModel> ActivationCodes { get; set; }
        public DbSet<ResetCodeModel> ResetCodes { get; set; }

        // DbSet for User
        public DbSet<UserBaseModel> Users { get; set; }
        public DbSet<MemberModel> Members { get; set; }
        public DbSet<TrainerModel> Trainers { get; set; }
        public DbSet<AdminModel> Admins { get; set; }
        public DbSet<ManagerModel> Managers { get; set; }

        // Dbset for Facility
        public DbSet<RoomModel> Rooms { get; set; }
        public DbSet<DeviceModel> Devices { get; set; }

        // DbSet for Booking   
        public DbSet<BookDeviceModel> Bookings { get; set; }

        // Dbset for Course
        public DbSet<CourseModel> Courses { get; set; }
        public DbSet<RegisteredCourseModel> RegisteredCourses { get; set; }

        // DbSet for TrainingRecord
        public DbSet<TrainingRecordModel> TrainingRecords { get; set; }
        // DbSet for Report
        public DbSet<ReportModel> Reports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            };

            var dictionaryConverter = new ValueConverter<Dictionary<string, TrainingDayStatus>, string>(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<Dictionary<string, TrainingDayStatus>>(v, options) ?? new()
            );

            var dictionaryComparer = new ValueComparer<Dictionary<string, TrainingDayStatus>>(
                (d1, d2) => JsonSerializer.Serialize(d1, options) == JsonSerializer.Serialize(d2, options),
                d => d == null ? 0 : JsonSerializer.Serialize(d, options).GetHashCode(),
                d => JsonSerializer.Deserialize<Dictionary<string, TrainingDayStatus>>(JsonSerializer.Serialize(d, options), options) ?? new()
            );

            modelBuilder.Entity<AccountModel>().ToTable("Accounts");
            modelBuilder.Entity<ActivationCodeModel>().ToTable("ActivationCodes");
            modelBuilder.Entity<ResetCodeModel>().ToTable("ResetCodes");
            modelBuilder.Entity<UserBaseModel>().ToTable("Users");
            modelBuilder.Entity<RoomModel>().ToTable("Rooms");
            modelBuilder.Entity<DeviceModel>().ToTable("Devices");
            modelBuilder.Entity<BookDeviceModel>().ToTable("Bookings");
            modelBuilder.Entity<CourseModel>().ToTable("Courses");
            modelBuilder.Entity<RegisteredCourseModel>().ToTable("RegisteredCourses");
            modelBuilder.Entity<MemberModel>().ToTable("Members");
            modelBuilder.Entity<TrainerModel>().ToTable("Trainers");
            modelBuilder.Entity<AdminModel>().ToTable("Admins");
            modelBuilder.Entity<ManagerModel>().ToTable("Managers");
            modelBuilder.Entity<TrainingRecordModel>().ToTable("TrainingRecords");
            modelBuilder.Entity<ReportModel>().ToTable("Reports");

            // Quan hệ giữa UserBaseModel và Account
            modelBuilder.Entity<UserBaseModel>()
                .HasOne(u => u.Account)
                .WithOne()
                .HasForeignKey<UserBaseModel>(u => u.AccountId)
                .OnDelete(DeleteBehavior.NoAction);

            // ActivationCode → Account
            modelBuilder.Entity<ActivationCodeModel>()
                .HasOne(a => a.Account)
                .WithMany()
                .HasForeignKey(a => a.AccountId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // ResetCode → Account
            modelBuilder.Entity<ResetCodeModel>()
                .HasOne(a => a.Account)
                .WithMany()
                .HasForeignKey(a => a.AccountId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // Device → Room
            modelBuilder.Entity<DeviceModel>()
                .HasOne(d => d.Room)
                .WithMany(r => r.Devices)
                .HasForeignKey(d => d.RoomId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // BookDevice → Device
            modelBuilder.Entity<BookDeviceModel>()
                .HasOne(b => b.Device)
                .WithMany()
                .HasForeignKey(b => b.DeviceId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // BookDevice → User
            modelBuilder.Entity<BookDeviceModel>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // Course → Room
            modelBuilder.Entity<CourseModel>()
                .HasOne(c => c.Room)
                .WithMany()
                .HasForeignKey(c => c.RoomId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // Course → Trainer
            modelBuilder.Entity<CourseModel>()
                .HasOne(c => c.Trainer)
                .WithMany()
                .HasForeignKey(c => c.TrainerId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // RegisteredCourse → Course
            modelBuilder.Entity<RegisteredCourseModel>()
                .HasOne(rc => rc.Course)
                .WithMany()
                .HasForeignKey(rc => rc.CourseId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            // RegisteredCourse → Member
            modelBuilder.Entity<RegisteredCourseModel>()
                .HasOne(rc => rc.Member)
                .WithMany()
                .HasForeignKey(rc => rc.MemberId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
            // Thay đổi để tránh vòng lặp

            modelBuilder.Entity<TrainingRecordModel>()
                .HasOne<RegisteredCourseModel>()
                .WithMany()
                .HasForeignKey(tr => tr.RegisteredCourseId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TrainingRecordModel>()
                .Property(e => e.Status)
                .HasConversion(dictionaryConverter)
                .Metadata.SetValueComparer(dictionaryComparer);

            modelBuilder.Entity<ReportModel>()
                .HasOne(r => r.CreatedByUser)
                .WithMany()
                .HasForeignKey(r => r.CreatedBy)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
