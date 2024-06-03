using ConcertReservationSystem.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Dodaj us�ugi do kontenera.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
// Dowiedz si� wi�cej o konfigurowaniu Swagger/OpenAPI pod adresem https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Konfiguruj potok ��dania HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Dodaj obs�ug� CORS
app.UseCors(policy =>
{
    policy.AllowAnyOrigin(); // Mo�esz te� okre�li� konkretn� domen� lub adres URL
    policy.AllowAnyMethod();
    policy.AllowAnyHeader();
});

app.MapControllers();

app.Run();
