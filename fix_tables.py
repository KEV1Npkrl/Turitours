import os

replacements = {
    'Agencia.java': ('"Agencia"', '"agencias"'),
    'Caja.java': ('"Caja"', '"cajas"'),
    'CategoriaTour.java': ('"categoriatour"', '"categorias_tour"'),
    'Destino.java': ('"Destino"', '"destinos"'),
    'Pago.java': ('"Pago"', '"pagos"'),
    'Reserva.java': ('"Reserva"', '"reservas"'),
    'Rol.java': ('"Rol"', '"roles"'),
    'Superadmin.java': ('"Superadmin"', '"superadmins"'),
    'Tour.java': ('"Tour"', '"tours"'),
    'Turista.java': ('"Turista"', '"turistas"'),
    'Usuario.java': ('"Usuario"', '"usuarios"')
}

path = r'c:\xampp\htdocs\turitours\backend_java\src\main\java\com\turitours\backend\entity'

for filename, (old, new) in replacements.items():
    filepath = os.path.join(path, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace(old, new)
    
    with open(filepath, 'w') as f:
        f.write(content)

print('Done')
