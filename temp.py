def format_file(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        lines = infile.readlines()
        for i, line in enumerate(lines):
            # Remove any leading/trailing whitespace
            line = line.strip()
            
            # Add three tabs, single quotes, and comma
            formatted_line = f"\t\t\t'{line}'"
            
            # Add comma if it's not the last line
            if i < len(lines) - 1:
                formatted_line += ','
            
            # Write the formatted line to the output file
            outfile.write(formatted_line + '\n')

# Example usage
input_file = '/Users/sameeweir/Upwork/Webflow/Contact Form/blocked_domains.txt'
output_file = '/Users/sameeweir/Upwork/Webflow/Contact Form/output.txt'

format_file(input_file, output_file)
print(f"Formatted content has been written to {output_file}")
