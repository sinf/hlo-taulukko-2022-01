using Microsoft.EntityFrameworkCore;
using MyApi.Models;
using Microsoft.Extensions.DependencyInjection;
var cors_thing = "_whatever";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
	options.AddPolicy(name: cors_thing,
		builder => {
			builder.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
		});
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<MyDbContext>(opt=>opt.UseInMemoryDatabase("personnel"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors(cors_thing);
app.UseAuthorization();

app.MapControllers();

app.Run();