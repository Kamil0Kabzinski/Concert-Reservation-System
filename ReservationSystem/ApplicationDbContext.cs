using Microsoft.EntityFrameworkCore;
using ConcertReservationSystem.Models;

namespace ConcertReservationSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Reservation> Reservations { get; set; }

        // Dodaj inne DbSety dla innych modeli, jeśli istnieją

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Dodaj konfiguracje dla relacji, indeksów, ograniczeń itp.
        }
    }
}
