namespace HonorsInventoryApi.Models;

public class Equipment
{
    public int id { get; set; }
    public string model { get; set; } = "";
    public string equipment_type { get; set; } = "";
    public int location_id { get; set; }
    public DateTime created_at { get; set; } = DateTime.UtcNow;
    public DateTime updated_at { get; set; } = DateTime.UtcNow;
    public Location? Location { get; set; }
}

