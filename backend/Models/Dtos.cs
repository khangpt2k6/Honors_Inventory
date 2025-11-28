namespace HonorsInventoryApi.Models;

public class LocationDto
{
    public string? room_name { get; set; }
    public string? building_type { get; set; }
}

public class EquipmentDto
{
    public string? model { get; set; }
    public string? equipment_type { get; set; }
}

public class TransferDto
{
    public int location_id { get; set; }
}

