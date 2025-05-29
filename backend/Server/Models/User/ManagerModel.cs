namespace Server.Models.User
{
    public class ManagerModel : UserBaseModel   
    {
        public required string Department { get; set; }
    }
}