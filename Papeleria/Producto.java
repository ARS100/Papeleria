
/**
 * Write a description of class Productos here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Producto
{
    private static int contadorId = 0; 
    private int idProducto;
    private String nombre;
    private int cantidad;
    private double precio;
    
    public Producto(String nombre, int cantidad, double precio)
    {
        this.idProducto = contadorId++;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
    }

    public String getName(){
        return nombre;    
    }
    
    public int getStock()
    {
        return cantidad;
    }
    
    public double getPrice()
    {
        return precio;
    }
    
    public double getTotalValue()
    {
        return precio*cantidad;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }
}
