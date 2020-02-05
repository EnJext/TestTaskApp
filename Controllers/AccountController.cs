using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestTaskApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;


namespace TestTaskApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        UserManager<IdentityUser> userManager;
        private SignInManager<IdentityUser> signInManager;

        public AccountController(UserManager<IdentityUser> usrMgr, SignInManager<IdentityUser> sinMgr)
        {
            userManager = usrMgr;
            signInManager = sinMgr;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginModel model)
        {
            IdentityUser user = await userManager.FindByEmailAsync(model.Email);

            if (user != null)
            {
                await signInManager.SignOutAsync();
                var result = await signInManager.PasswordSignInAsync(user, model.Password, false, false);

                if (result.Succeeded)
                {
                    var encodedJwt = GetJwtToken(user);

                    return Ok(new { access_token = encodedJwt});
                }
            }
            return BadRequest(new { errorText = "Invalid email or password." });
        }

        private async Task<string> GetJwtToken(IdentityUser user)
        {
            var now = DateTime.UtcNow;

            var claims = new List<Claim> 
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.UserName)
                };

            var roles = await userManager.GetRolesAsync(user);

            foreach (var role in roles) claims.Add(new Claim(ClaimTypes.Role, role));

            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                notBefore: now,
                expires : now.Add(TimeSpan.FromHours(AuthOptions.LIFETIME)),
                claims: claims,
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }


        [HttpGet]
        [Authorize] 
        public IActionResult testAuth() => Ok(new { name = User.Identity.Name});

    }
}
