using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MyPersonnelController : ControllerBase
    {
        private readonly MyDbContext _context;

        public MyPersonnelController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/MyPersonnel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> Getpersonnel()
        {
            return await _context.personnel.ToListAsync();
        }

        // GET: api/MyPersonnel/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(long id)
        {
            var person = await _context.personnel.FindAsync(id);

            if (person == null)
            {
                return NotFound();
            }

            return person;
        }

        // PUT: api/MyPersonnel/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(long id, Person person)
        {
            if (id != person.Id)
            {
                return BadRequest();
            }

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MyPersonnel
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Person>> PostPerson(Person person)
        {
            bool update = false;
            if (PersonExists(person.Id)) {
                update = true;
                _context.personnel.Update(person);
            } else {
                _context.personnel.Add(person);
            }

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateException) {
                throw;
            }

            if (update) {
                Console.Write("\nUpdate {0} {1} {2} {3}\n", person.Id, person.lname, person.fname, person.age);
            } else {
                Console.Write("\nCreate {0} {1} {2} {3}\n", person.Id, person.lname, person.fname, person.age);
            }

            return CreatedAtAction(nameof(GetPerson), new { id = person.Id }, person);
        }

        // DELETE: api/MyPersonnel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(long id)
        {
            var person = await _context.personnel.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.personnel.Remove(person);
            await _context.SaveChangesAsync();
            Console.Write("\nDelete {0} {1} {2} {3}\n", person.Id, person.lname, person.fname, person.age);

            return NoContent();
        }

        private bool PersonExists(long id)
        {
            return _context.personnel.Any(e => e.Id == id);
        }
    }
}
