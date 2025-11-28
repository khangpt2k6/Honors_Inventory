using Microsoft.EntityFrameworkCore;
using HonorsInventoryApi.Models;

namespace HonorsInventoryApi.Data;

public class InventoryDb : DbContext
{
    public InventoryDb(DbContextOptions<InventoryDb> options) : base(options) { }
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Equipment> Equipment => Set<Equipment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Location>().ToTable("locations").HasIndex(l => l.room_name).IsUnique();
        modelBuilder.Entity<Equipment>().ToTable("equipment")
            .HasOne(e => e.Location).WithMany().HasForeignKey(e => e.location_id);
    }
}

