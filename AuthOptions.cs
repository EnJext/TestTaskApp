using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace TestTaskApp
{
    public class AuthOptions
    {
        public const string ISSUER = "TestApp"; 
        public const string AUDIENCE = "TestAppClient"; 
        const string KEY = "mysupersecret_key_fk2394vjq01kvn27";
        public const int LIFETIME = 1; 

        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
