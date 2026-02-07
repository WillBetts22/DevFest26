from PIL import Image, ImageFilter
import os

# Define the emoji files to process
emoji_files = {
    "happy": "happy.jpg",
    "mad": "mad.jpg",
    "sad": "sad.jpg",
    "sleepy": "sleepy.jpg",
    "smiley": "smiley.jpg"
}

# Resolution multiplier (increase by 4x for better quality)
scale_factor = 4

# Line thickness factor (how much to thicken the lines)
thicken_iterations = 3

# Create output directory
output_dir = "processed_emojis"
os.makedirs(output_dir, exist_ok=True)

def thicken_lines(img):
    """Thicken the dark lines by dilating them"""
    # Apply MaxFilter multiple times to thicken lines
    for _ in range(thicken_iterations):
        img = img.filter(ImageFilter.MaxFilter(3))
    return img

for name, file_path in emoji_files.items():
    print(f"Processing {name}...")

    # Open the image and convert to RGBA
    img = Image.open(file_path).convert("RGBA")

    # Get original size
    original_width, original_height = img.size
    print(f"  Original size: {original_width}x{original_height}")

    # First, aggressively remove ALL white and light pixels
    pixels = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x, y]
            # Remove any pixel that's lighter than dark gray (more aggressive)
            if r > 200 or g > 200 or b > 200:
                pixels[x, y] = (255, 255, 255, 0)  # Transparent
            else:
                # Keep dark pixels but make them pure black
                pixels[x, y] = (0, 0, 0, 255)

    # Thicken the lines
    img = thicken_lines(img)

    # Increase resolution using high-quality resampling
    new_width = original_width * scale_factor
    new_height = original_height * scale_factor
    img_upscaled = img.resize((new_width, new_height), Image.LANCZOS)

    print(f"  New size: {new_width}x{new_height}")

    # Final pass to remove any remaining light pixels introduced by upscaling
    pixels_upscaled = img_upscaled.load()
    for y in range(img_upscaled.height):
        for x in range(img_upscaled.width):
            r, g, b, a = pixels_upscaled[x, y]
            if a > 0 and (r > 150 or g > 150 or b > 150):
                # Make remaining light pixels pure black
                pixels_upscaled[x, y] = (0, 0, 0, 255)

    # Save the processed image
    output_path = os.path.join(output_dir, f"{name}.png")
    img_upscaled.save(output_path, "PNG")
    print(f"  Saved: {output_path}")

print(f"\nAll emojis processed and saved to '{output_dir}/' directory!")
print(f"Resolution increased by {scale_factor}x with transparent backgrounds")
