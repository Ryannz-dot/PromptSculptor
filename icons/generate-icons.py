#!/usr/bin/env python3
"""
PromptSculptor Icon Generator
Generates PNG icons for the Chrome extension
"""

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Error: PIL (Pillow) is required to run this script.")
    print("Install it with: pip install Pillow")
    exit(1)

def create_icon(size, filename):
    """Create a single icon with specified size"""

    # Create image with purple gradient background
    img = Image.new('RGB', (size, size), '#8b5cf6')
    draw = ImageDraw.Draw(img)

    # Draw a star shape
    center_x, center_y = size // 2, size // 2
    outer_radius = int(size * 0.35)
    inner_radius = int(size * 0.15)
    points = 5

    star_points = []
    for i in range(points * 2):
        radius = outer_radius if i % 2 == 0 else inner_radius
        angle = (i * 3.14159) / points - 3.14159 / 2
        x = center_x + int(radius * (angle ** 2 - angle) ** 0.5)
        y = center_y + int(radius * angle)
        star_points.append((x, y))

    # Draw the star
    draw.polygon(star_points, fill='white', outline='white')

    # Add rounded corners
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = int(size * 0.2)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)

    # Apply rounded corners
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)

    # Save the icon
    output.save(filename, 'PNG')
    print(f"✓ Created {filename} ({size}x{size})")

def main():
    """Generate all required icons"""
    print("Generating PromptSculptor icons...")
    print()

    try:
        create_icon(16, 'icon16.png')
        create_icon(48, 'icon48.png')
        create_icon(128, 'icon128.png')

        print()
        print("✨ All icons generated successfully!")
        print("You can now load the extension in Chrome.")

    except Exception as e:
        print(f"Error generating icons: {e}")
        exit(1)

if __name__ == '__main__':
    main()
