// -- IMPORTS

import { getLocalizedText } from "senselogic-lingo";
import
    {
        getApplicationData,
        getFooterMenuData,
        getHeaderMenuData,
        isValidLanguageTag,
        resolveRequestLanguageTag
    }
    from "./application.ts";
import type { PageViewData } from "./application_data.ts";

// -- TYPES

export interface RouteContext
{
    request: Request;
    url: URL;
    meta?: Record<string, unknown>;
}

// -- FUNCTIONS

export function getInvalidLanguageTagResponse(
    languageTagParameter: string
    ) : Response | null
{
    if ( isValidLanguageTag( languageTagParameter ) )
    {
        return null;
    }
    else
    {
        return new Response( "Not Found", { status: 404 } );
    }
}

// ~~

export function buildBasePageViewData(
    routeContext: RouteContext,
    languageTagParameter: string
    ) : PageViewData
{
    let applicationDataValue = getApplicationData();
    let languageTag = resolveRequestLanguageTag( routeContext, languageTagParameter );

    return (
        {
            languageTag,
            homePage: applicationDataValue.homePage,
            ...getHeaderMenuData( applicationDataValue, routeContext ),
            ...getFooterMenuData( applicationDataValue )
        }
        );
}

// ~~

export function setPageTitleMeta(
    routeContext: RouteContext,
    titleText: string,
    languageTag: string
    ) : void
{
    routeContext.meta =
        {
            ...( routeContext.meta ?? {} ),
            pageTitle: `${ getLocalizedText( titleText, languageTag ) } - Miko Project`
        };
}
