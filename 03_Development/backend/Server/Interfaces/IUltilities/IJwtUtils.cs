namespace Server.Interfaces.IUltilities
{
    public interface IJwtUtils
    {
        string GenerateToken(Guid accountId, string role, Guid userId, string? department = null, string? specialization = null);
    }
}