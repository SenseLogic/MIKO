// -- IMPORTS

import { getApplicationData } from "../../../lib/application.ts";
import { handleLanguagePage } from "../../../lib/page_handler.ts";

// -- FUNCTIONS

export const GET = Run.GET(
    (
        context,
        next
    ) =>
    {
        let applicationDataValue = getApplicationData();
        let handlerResult = handleLanguagePage(
            context,
            context.params.languageTag as string,
            ( applicationData ) =>
            (
                {
                    aboutPage: applicationData.aboutPage
                }
                ),
            applicationDataValue.aboutPage.title as string
            );

        if ( handlerResult instanceof Response )
        {
            return handlerResult;
        }
        else
        {
            return next( handlerResult );
        }
    }
    );
