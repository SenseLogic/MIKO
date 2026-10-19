// -- IMPORTS

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getBrowserLanguageCode, getDefaultLanguageCode, getLocalizedText } from "senselogic-lingo";
import { readGsonFileValue } from "senselogic-gson-file";
import type { ApplicationData } from "./application_data.ts";
import { initializeLingo } from "./localization.ts";

// -- CONSTANTS

const projectRootPath = getProjectRootPath();

// -- VARIABLES

let applicationData: ApplicationData | null = null;

// -- FUNCTIONS

function getProjectRootPath(
    ) : string
{
    let candidatePath = dirname( fileURLToPath( import.meta.url ) );

    while ( candidatePath !== dirname( candidatePath ) )
    {
        if ( existsSync( join( candidatePath, "data", "application_data.gson" ) ) )
        {
            return candidatePath;
        }
        else
        {
            candidatePath = dirname( candidatePath );
        }
    }

    throw new Error( "Could not locate data/application_data.gson from project root" );
}

// ~~

export function readDataFile(
    filePath: string
    ) : string
{
    let applicationDataFile = readFileSync(
        join( projectRootPath, filePath )
        );

    return applicationDataFile.toString( "utf-8" );
}

// ~~

export function getApplicationData(
    ) : ApplicationData
{
    if ( applicationData === null )
    {
        try
        {
            applicationData = readGsonFileValue(
                "data/application_data.gson",
                true,
                readDataFile
                ) as ApplicationData;
        }
        catch ( error )
        {
            console.error( error );
            throw error;
        }
    }

    return applicationData;
}

// ~~

export function getHeaderMenuData(
    applicationDataValue: ApplicationData,
    request: unknown = null
    )
    : {
        homePage: ApplicationData[ "homePage" ];
        headerMenu: ApplicationData[ "headerMenu" ];
        languageByTagMap: ApplicationData[ "languageByTagMap" ];
        pageUrlByLanguageTagMap: Record<string, string>;
    }
{
    return (
        {
            homePage: applicationDataValue.homePage,
            headerMenu: applicationDataValue.headerMenu,
            languageByTagMap: applicationDataValue.languageByTagMap,
            pageUrlByLanguageTagMap: getPageUrlByLanguageTagMapFromRequest( request )
        }
        );
}

// ~~

export function getFooterMenuData(
    applicationDataValue: ApplicationData
    )
    : {
        homePage: ApplicationData[ "homePage" ];
        footerMenu: ApplicationData[ "footerMenu" ];
    }
{
    return (
        {
            homePage: applicationDataValue.homePage,
            footerMenu: applicationDataValue.footerMenu
        }
        );
}

// ~~

export function getPageUrlByLanguageTagMap(
    pathWithoutLanguage: string,
    search: string = ""
    ) : Record<string, string>
{
    let pageUrlByLanguageTagMap: Record<string, string> = {};

    for ( let optionLanguageTag of getLanguageTagArray() )
    {
        pageUrlByLanguageTagMap[ optionLanguageTag ]
            = getLanguageTagPath( pathWithoutLanguage, optionLanguageTag ) + search;
    }

    return pageUrlByLanguageTagMap;
}

// ~~

export function getRequestUrl(
    request: unknown
    ) : string | null
{
    if ( typeof request === "string" )
    {
        return request;
    }
    else if (
        request !== null
        && typeof request === "object"
        && "url" in request
        && request.url instanceof URL
        )
    {
        return request.url.href;
    }
    else if (
        request !== null
        && typeof request === "object"
        && "url" in request
        && typeof request.url === "string"
        )
    {
        return request.url;
    }
    else if ( request instanceof Request )
    {
        return request.url;
    }
    else
    {
        return null;
    }
}

// ~~

export function getPageUrlByLanguageTagMapFromRequest(
    request: unknown
    ) : Record<string, string>
{
    let url = getRequestUrl( request );

    if ( url )
    {
        let parsedUrl = new URL( url );
        let pathWithoutLanguage = getPathWithoutLanguage( parsedUrl.pathname );

        return getPageUrlByLanguageTagMap( pathWithoutLanguage, parsedUrl.search );
    }
    else
    {
        return getPageUrlByLanguageTagMap( "/" );
    }
}

// ~~

export function getLocalizedTextBySlug(
    slug: string,
    languageTag: string
    ) : string
{
    let applicationDataValue = getApplicationData();
    let text = applicationDataValue.textBySlugMap[ slug ];

    if ( typeof text === "string" )
    {
        return getLocalizedText( text, languageTag );
    }
    else
    {
        return slug;
    }
}

// ~~

export function getLanguageTagArray(
    ) : string[]
{
    let applicationDataValue = getApplicationData();

    return Object.keys( applicationDataValue.languageByTagMap );
}

// ~~

export function isValidLanguageTag(
    languageTag: string
    ) : boolean
{
    let availableLanguageTagArray = getLanguageTagArray();

    return availableLanguageTagArray.includes( languageTag );
}

// ~~

export function getRequestBrowserLanguageTag(
    request: unknown
    ) : string
{
    let acceptLanguage: string | null = null;

    if (
        request !== null
        && typeof request === "object"
        && "request" in request
        && request.request instanceof Request
        )
    {
        acceptLanguage = request.request.headers.get( "Accept-Language" );
    }
    else if ( request instanceof Request )
    {
        acceptLanguage = request.headers.get( "Accept-Language" );
    }
    else if (
        request !== null
        && typeof request === "object"
        && "headers" in request
        && request.headers !== null
        && typeof request.headers === "object"
        && "get" in request.headers
        && typeof request.headers.get === "function"
        )
    {
        acceptLanguage = request.headers.get( "Accept-Language" );
    }
    else
    {
        return getDefaultLanguageCode();
    }

    if ( acceptLanguage )
    {
        return getBrowserLanguageCode(
            acceptLanguage,
            getLanguageTagArray(),
            getDefaultLanguageCode()
            );
    }
    else
    {
        return getDefaultLanguageCode();
    }
}

// ~~

export function getPathLanguageTag(
    pathname: string
    ) : string | null
{
    let pathPartArray = pathname.replace( /^\//, "" ).split( "/" );

    if ( pathPartArray.length > 0 && pathPartArray[ 0 ] !== "" )
    {
        let languageTag = pathPartArray[ 0 ];

        if ( isValidLanguageTag( languageTag ) )
        {
            return languageTag;
        }
        else
        {
            return null;
        }
    }
    else
    {
        return null;
    }
}

// ~~

export function getPathWithoutLanguage(
    path: string
    ) : string
{
    let languageTag = getPathLanguageTag( path );

    if ( languageTag )
    {
        return "/" + path.replace( /^\//, "" ).split( "/" ).slice( 1 ).join( "/" );
    }
    else
    {
        return path;
    }
}

// ~~

export function getRequestLanguageTag(
    request: unknown
    ) : string
{
    let url = getRequestUrl( request );

    if ( url )
    {
        let path = new URL( url ).pathname;
        let languageTag = getPathLanguageTag( path );

        if ( languageTag )
        {
            return languageTag;
        }
        else
        {
            return getRequestBrowserLanguageTag( request );
        }
    }
    else
    {
        return getDefaultLanguageCode();
    }
}

// ~~

export function resolveRequestLanguageTag(
    request: unknown,
    languageTag: string | null = null
    ) : string
{
    if ( languageTag )
    {
        return languageTag;
    }
    else
    {
        return getRequestLanguageTag( request );
    }
}

// ~~

export function getLanguageTagPath(
    path: string,
    languageTag: string
    ) : string
{
    if ( isValidLanguageTag( languageTag ) )
    {
        let pathWithoutLanguage = getPathWithoutLanguage( path );

        if ( pathWithoutLanguage.startsWith( "/" ) )
        {
            if ( pathWithoutLanguage === "/" )
            {
                return `/${ languageTag }`;
            }
            else
            {
                return `/${ languageTag }${ pathWithoutLanguage }`;
            }
        }
        else
        {
            pathWithoutLanguage = "/" + pathWithoutLanguage;

            if ( pathWithoutLanguage === "/" )
            {
                return `/${ languageTag }`;
            }
            else
            {
                return `/${ languageTag }${ pathWithoutLanguage }`;
            }
        }
    }
    else
    {
        return path;
    }
}

// -- STATEMENTS

initializeLingo();
