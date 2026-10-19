// -- IMPORTS

import
    {
        getPathLanguageTag,
        getPathWithoutLanguage,
        getRequestLanguageTag
    }
    from "../lib/application.ts";

// -- FUNCTIONS

export default Run.ALL(
    (
        context,
        next
    ) =>
    {
        let pathname = context.url.pathname;

        if ( pathname.startsWith( "/api/" )
             || pathname.startsWith( "/static/" )
             || pathname === "/logo.svg"
             || pathname === "/favicon.ico" )
        {
            return next();
        }
        else
        {
            let pathLanguageTag = getPathLanguageTag( pathname );

            if ( pathLanguageTag )
            {
                return next();
            }
            else
            {
                let languageTag = getRequestLanguageTag( context );
                let pathWithoutLanguage = getPathWithoutLanguage( pathname );
                let redirectUrl = `/${ languageTag }${
                    pathWithoutLanguage === "/" ? "" : pathWithoutLanguage
                    }`;

                return context.redirect( redirectUrl );
            }
        }
    }
    );
