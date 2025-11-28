using Microsoft.EntityFrameworkCore;
using HonorsInventoryApi.Data;
using HonorsInventoryApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
});

builder.Services.AddDbContext<InventoryDb>(opt => opt.UseSqlite("Data Source=inventory.db"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventoryDb>();
    db.Database.EnsureCreated();
}

app.UseCors();

app.MapGet("/api/locations", async (InventoryDb db) =>
{
    var locations = await db.Locations
        .OrderBy(l => l.building_type)
        .ThenBy(l => l.room_name)
        .ToListAsync();
    return Results.Ok(locations);
});

app.MapGet("/api/locations/{id}", async (int id, InventoryDb db) =>
{
    var location = await db.Locations.FindAsync(id);
    return location is null ? Results.NotFound(new { error = "Location not found" }) : Results.Ok(location);
});

app.MapPost("/api/locations", async (LocationDto dto, InventoryDb db) =>
{
    if (string.IsNullOrEmpty(dto.room_name) || string.IsNullOrEmpty(dto.building_type))
        return Results.BadRequest(new { error = "room_name and building_type are required" });

    var location = new Location { room_name = dto.room_name, building_type = dto.building_type };
    db.Locations.Add(location);
    
    try
    {
        await db.SaveChangesAsync();
        return Results.Created($"/api/locations/{location.id}", location);
    }
    catch (DbUpdateException)
    {
        return Results.BadRequest(new { error = "Location with this room name already exists" });
    }
});

app.MapGet("/api/equipment", async (int? location_id, string? equipment_type, string? building_type, InventoryDb db) =>
{
    var query = db.Equipment.Include(e => e.Location).AsQueryable();

    if (location_id.HasValue)
        query = query.Where(e => e.location_id == location_id.Value);
    if (!string.IsNullOrEmpty(equipment_type))
        query = query.Where(e => e.equipment_type == equipment_type);
    if (!string.IsNullOrEmpty(building_type))
        query = query.Where(e => e.Location!.building_type == building_type);

    var equipment = await query
        .OrderBy(e => e.equipment_type)
        .ThenBy(e => e.model)
        .Select(e => new EquipmentResponse
        {
            id = e.id,
            model = e.model,
            equipment_type = e.equipment_type,
            location_id = e.location_id,
            room_name = e.Location!.room_name,
            building_type = e.Location.building_type,
            created_at = e.created_at,
            updated_at = e.updated_at
        })
        .ToListAsync();

    return Results.Ok(equipment);
});

app.MapGet("/api/equipment/{id}", async (int id, InventoryDb db) =>
{
    var equipment = await db.Equipment
        .Include(e => e.Location)
        .Where(e => e.id == id)
        .Select(e => new EquipmentResponse
        {
            id = e.id,
            model = e.model,
            equipment_type = e.equipment_type,
            location_id = e.location_id,
            room_name = e.Location!.room_name,
            building_type = e.Location.building_type,
            created_at = e.created_at,
            updated_at = e.updated_at
        })
        .FirstOrDefaultAsync();

    return equipment is null ? Results.NotFound(new { error = "Equipment not found" }) : Results.Ok(equipment);
});

app.MapPost("/api/equipment", async (EquipmentDto dto, InventoryDb db) =>
{
    if (string.IsNullOrEmpty(dto.model) || string.IsNullOrEmpty(dto.equipment_type))
        return Results.BadRequest(new { error = "model and equipment_type are required" });

    var warehouse = await db.Locations.FirstOrDefaultAsync(l => l.building_type == "Warehouse");
    if (warehouse is null)
        return Results.BadRequest(new { error = "No warehouse location found. Please create a warehouse first." });

    var equipment = new Equipment
    {
        model = dto.model,
        equipment_type = dto.equipment_type,
        location_id = warehouse.id
    };

    db.Equipment.Add(equipment);
    await db.SaveChangesAsync();

    return Results.Created($"/api/equipment/{equipment.id}", new EquipmentResponse
    {
        id = equipment.id,
        model = equipment.model,
        equipment_type = equipment.equipment_type,
        location_id = equipment.location_id,
        room_name = warehouse.room_name,
        building_type = warehouse.building_type,
        created_at = equipment.created_at,
        updated_at = equipment.updated_at
    });
});

app.MapPut("/api/equipment/{id}", async (int id, EquipmentDto dto, InventoryDb db) =>
{
    var equipment = await db.Equipment.Include(e => e.Location).FirstOrDefaultAsync(e => e.id == id);
    if (equipment is null)
        return Results.NotFound(new { error = "Equipment not found" });

    if (string.IsNullOrEmpty(dto.model) && string.IsNullOrEmpty(dto.equipment_type))
        return Results.BadRequest(new { error = "No valid fields to update" });

    if (!string.IsNullOrEmpty(dto.model)) equipment.model = dto.model;
    if (!string.IsNullOrEmpty(dto.equipment_type)) equipment.equipment_type = dto.equipment_type;
    equipment.updated_at = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(new EquipmentResponse
    {
        id = equipment.id,
        model = equipment.model,
        equipment_type = equipment.equipment_type,
        location_id = equipment.location_id,
        room_name = equipment.Location!.room_name,
        building_type = equipment.Location.building_type,
        created_at = equipment.created_at,
        updated_at = equipment.updated_at
    });
});

app.MapPatch("/api/equipment/{id}/transfer", async (int id, TransferDto dto, InventoryDb db) =>
{
    if (dto.location_id <= 0)
        return Results.BadRequest(new { error = "location_id is required" });

    var equipment = await db.Equipment.FindAsync(id);
    if (equipment is null)
        return Results.NotFound(new { error = "Equipment not found" });

    var location = await db.Locations.FindAsync(dto.location_id);
    if (location is null)
        return Results.NotFound(new { error = "Location not found" });

    equipment.location_id = dto.location_id;
    equipment.updated_at = DateTime.UtcNow;
    await db.SaveChangesAsync();

    return Results.Ok(new EquipmentResponse
    {
        id = equipment.id,
        model = equipment.model,
        equipment_type = equipment.equipment_type,
        location_id = equipment.location_id,
        room_name = location.room_name,
        building_type = location.building_type,
        created_at = equipment.created_at,
        updated_at = equipment.updated_at
    });
});

app.MapDelete("/api/equipment/{id}", async (int id, InventoryDb db) =>
{
    var equipment = await db.Equipment.FindAsync(id);
    if (equipment is null)
        return Results.NotFound(new { error = "Equipment not found" });

    db.Equipment.Remove(equipment);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Equipment deleted successfully", id });
});

app.MapGet("/api/equipment-types", async (InventoryDb db) =>
{
    var types = await db.Equipment
        .Select(e => e.equipment_type)
        .Distinct()
        .OrderBy(t => t)
        .ToListAsync();
    return Results.Ok(types);
});

app.MapGet("/api/stats", async (InventoryDb db) =>
{
    var total = await db.Equipment.CountAsync();

    var byLocation = await db.Locations
        .GroupJoin(db.Equipment, l => l.id, e => e.location_id, (l, equipment) => new { l.building_type, count = equipment.Count() })
        .GroupBy(x => x.building_type)
        .Select(g => new { building_type = g.Key, count = g.Sum(x => x.count) })
        .ToListAsync();

    var byType = await db.Equipment
        .GroupBy(e => e.equipment_type)
        .Select(g => new { equipment_type = g.Key, count = g.Count() })
        .OrderByDescending(t => t.count)
        .ToListAsync();

    return Results.Ok(new { total, byLocation, byType });
});

Console.WriteLine("Honors IT Inventory API running on http://localhost:3001");
app.Run("http://localhost:3001");
