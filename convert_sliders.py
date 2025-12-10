import re

# Leer el archivo
with open(r'd:\SuperImprimible\Super Produccion\powerpoint-addin\prototipo-hermoso.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Patrón para encontrar sliders con estructura de 2 filas
pattern = r'<div class="slider-control">\s*<div class="slider-label">\s*<span>([^<]+)</span>\s*<span>([^<]+)</span>\s*</div>\s*<input([^>]+)>\s*</div>'

# Reemplazo con estructura de 3 columnas
replacement = r'<div class="slider-control"><div class="slider-label">\1</div><input\3><div class="slider-value">\2</div></div>'

# Aplicar el reemplazo
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Guardar el nuevo archivo
with open(r'd:\SuperImprimible\Super Produccion\powerpoint-addin\prototipo-3col.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Conversión completada!")
