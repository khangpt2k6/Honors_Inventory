namespace HonorsInventoryApi.Models;

public class EquipmentResponse
{
    public int id { get; set; }
    public string model { get; set; } = "";
    public string equipment_type { get; set; } = "";
    public int location_id { get; set; }
    public string room_name { get; set; } = "";
    public string building_type { get; set; } = "";
    public DateTime created_at { get; set; }
    public DateTime updated_at { get; set; }
}

