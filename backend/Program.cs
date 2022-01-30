using Microsoft.EntityFrameworkCore;
using MyApi.Models;
using Microsoft.Extensions.DependencyInjection;
var cors_thing = "_whatever";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
var db = Environment.GetEnvironmentVariable("DATABASE");
if (db != null) {
	Console.Write("\nUsing database: {0}\n", db);
	builder.Services.AddSqlite<MyDbContext>("Data Source=" + db);
} else {
	Console.Write("\nUsing in-memory database\n");
	builder.Services.AddDbContext<MyDbContext>(opts => opts.UseInMemoryDatabase("personnel"));
}

builder.Services.AddCors(options => {
	options.AddPolicy(name: cors_thing,
		builder => {
			builder.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
		});
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors(cors_thing);
app.UseAuthorization();

app.MapControllers();

app.Run();
