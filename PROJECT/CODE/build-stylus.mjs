// -- IMPORTS

import stylus from "stylus";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// -- CONSTANTS

const projectRootPath = dirname( fileURLToPath( import.meta.url ) );
const stylusInputPath = join( projectRootPath, "styles", "main.styl" );
const cssOutputPath = join( projectRootPath, "public", "static", "styles", "main.css" );
const styleFolderPath = join( projectRootPath, "styles" );

// -- FUNCTIONS

async function compileStylus(
    )
{
    try
    {
        let stylusSourceText = await readFile( stylusInputPath, "utf8" );
        let compilationResult = await new Promise(
            ( resolve, reject ) =>
            {
                stylus( stylusSourceText )
                    .set( "filename", stylusInputPath )
                    .set( "paths", [ styleFolderPath ] )
                    .set( "compress", true )
                    .render(
                        ( stylusCompilationError, cssText ) =>
                        {
                            if ( stylusCompilationError )
                            {
                                reject( stylusCompilationError );
                            }
                            else
                            {
                                resolve( cssText );
                            }
                        }
                        );
            }
            );

        await mkdir( dirname( cssOutputPath ), { recursive: true } );
        await writeFile( cssOutputPath, compilationResult );

        console.log(
            `Stylus compiled successfully: ${ stylusInputPath } -> ${ cssOutputPath }`
            );
    }
    catch ( stylusCompilationError )
    {
        console.error( "Stylus compilation failed:", stylusCompilationError );

        process.exit( 1 );
    }
}

// -- STATEMENTS

await compileStylus();
