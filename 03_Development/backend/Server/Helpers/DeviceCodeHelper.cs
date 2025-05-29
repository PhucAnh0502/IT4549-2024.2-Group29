namespace Server.Helpers
{
    public class DeviceCodeHelper
    {
        public static string GenerateDeviceCode(string deviceType, string manufacturer)
        {
            var deviceTypeCode = deviceType.Substring(0, 2).ToUpper();
            var manufacturerCode = manufacturer.Substring(0, 2).ToUpper();
            var random = new Random();
            var randomNumber = random.Next(1000, 9999);

            return $"{deviceTypeCode}-{manufacturerCode}-{randomNumber}";
        }
    }
}