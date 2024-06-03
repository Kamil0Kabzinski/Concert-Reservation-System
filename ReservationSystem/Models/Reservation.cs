using System;

namespace ConcertReservationSystem.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public int SeatNumber { get; set; }
        public DateTime ReservationTime { get; set; }
        // Dodaj dodatkowe właściwości według potrzeb
    }
}
