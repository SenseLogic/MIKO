// -- IMPORTS

import { getApplicationData } from "./application.ts";
import type { ApplicationData, PageViewData } from "./application_data.ts";
import
    {
        buildBasePageViewData,
        getInvalidLanguageTagResponse,
        setPageTitleMeta,
        type RouteContext
    }
    from "./page_context.ts";

// -- FUNCTIONS

export function handleLanguagePage(
    routeContext: RouteContext,
    languageTagParameter: string,
    pageViewExtensionBuilder: (
        applicationDataValue: ApplicationData
        ) => Partial<PageViewData>,
    titleText: string
    ) : Response | { pageViewData: PageViewData }
{
    let invalidLanguageTagResponse = getInvalidLanguageTagResponse( languageTagParameter );

    if ( invalidLanguageTagResponse !== null )
    {
        return invalidLanguageTagResponse;
    }
    else
    {
        let applicationDataValue = getApplicationData();
        let pageViewData: PageViewData
            = {
                ...buildBasePageViewData( routeContext, languageTagParameter ),
                ...pageViewExtensionBuilder( applicationDataValue )
            };

        setPageTitleMeta( routeContext, titleText, pageViewData.languageTag );

        return { pageViewData };
    }
}
