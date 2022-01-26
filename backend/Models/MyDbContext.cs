using Microsoft.EntityFrameworkCore;
//using System.Diagnostics.CodeAnalysis;

namespace MyApi.Models {

	public class MyDbContext : DbContext
	{
		public MyDbContext(DbContextOptions<MyDbContext> opts) : base(opts)
		{
		}
		public DbSet<Person> personnel { get; set; } = null!;
	}
}

