namespace Server.Models.User
{
    public class TrainerModel : UserBaseModel
    {
        public required string Specialization { get; set; }
    }
}