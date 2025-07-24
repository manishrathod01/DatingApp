using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("auth")]
    public IActionResult GetAuth()
    {
        return Unauthorized();
    }
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        // var thing = context.Users.Find(-1);
        // if (thing == null) return NotFound();
        // return thing;
        return NotFound();
    }
    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        // var thing = context.Users.Find(-1) ?? throw new Exception("A bad thing happend");

        // return thing;
        throw new Exception("this is a server error");
    }
    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("this was not a good request");
    }

    [Authorize(Roles = "Admin")]
    [Route("admin-secret")]
    public ActionResult<string> GetSecretAdmin()
    {
        return Ok("Only admins should see this");
    }

}
