// scripts/autoIndex.js
// This script automatically generates an index of clue IDs and their corresponding clues.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try
{
    // Adjust this path to your clues.js file
    const cluesPath = path.join(__dirname, '../clues');

    // Get list of clues files (clues_A-D.js, clues_E-H.js, etc), sorted alphabetically
    const files = fs.readdirSync(cluesPath)
    .filter(file => file.startsWith("clues_") && file.endsWith('.js'))
    .sort();

    let clueCounter = 1;

    files.forEach(file => {
        const filePath = path.join(cluesPath, file);
        let fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');

        let newLines = [];
        let previousLineWasIndex = false;

        for(let i = 0; i < lines.length; i++)
        {
            const line = lines[i];

            // Check for clue index comments (e.g. // 1, // 2)
            // Match existing index comment lines
            if (line.trim().match(/^\/\/\s*\d+/))
            {
                // Replace with updated clueCounter 
                newLines.push(`\t// ${clueCounter}`);
                clueCounter++;
                previousLineWasIndex = true;
                continue; // skip adding original lines
            }

            if (line.trim().match(/^\d{1,4}:\s*{/)) 
            {
                if (!previousLineWasIndex)
                {
                    // No index above this line, so, insert one
                    newLines.push(`\t// ${clueCounter}`);
                    clueCounter++;
                }
            }
            
            previousLineWasIndex = false // reset if line is not index

            // otherwise, push oridinal lines
            newLines.push(line);
        }

        // Write back updated content to each file
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

        console.log(`✅ Updated indexes in ${file}`);
    });

    console.log(`🎉 All clue files indexed. Total clues indexed: ${clueCounter - 1}`);
}
catch(error)
{
    console.error("Error updating clues.js:", error);
    process.exit(1); // Exit with failure code
}