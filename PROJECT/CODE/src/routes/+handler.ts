// -- IMPORTS

import
    {
        getPathWithoutLanguage,
        getRequestLanguageTag
    }
    from "../lib/application.ts";

// -- FUNCTIONS

export const GET = Run.GET(
    (
        context
    ) =>
    {
        let languageTag = getRequestLanguageTag( context );
        let pathWithoutLanguage = getPathWithoutLanguage( context.url.pathname );
        let redirectUrl = `/${ languageTag }${
            pathWithoutLanguage === "/" ? "" : pathWithoutLanguage
            }`;

        return context.redirect( redirectUrl );
    }
    );
