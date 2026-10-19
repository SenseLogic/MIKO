// -- IMPORTS

import
    {
        defineDualTag,
        defineLineTag,
        defineTag,
        setDefaultLanguageCode,
        setLanguageSeparator
    }
    from "senselogic-lingo";

// -- FUNCTIONS

export function initializeLingo(
    ) : void
{
    setLanguageSeparator( "\n¨" );
    setDefaultLanguageCode( "en" );

    void
        [
            defineLineTag( "! ", "<div class=\"paragraph title-1\">", "</div>" ),
            defineLineTag( "!! ", "<div class=\"paragraph title-2\">", "</div>" ),
            defineLineTag( "!!! ", "<div class=\"paragraph title-3\">", "</div>" ),
            defineLineTag( "!!!! ", "<div class=\"paragraph title-4\">", "</div>" ),
            defineLineTag( "- ", "<div class=\"paragraph dash-bullet-1\">", "</div>" ),
            defineLineTag( "  - ", "<div class=\"paragraph dash-bullet-2\">", "</div>" ),
            defineLineTag( "    - ", "<div class=\"paragraph dash-bullet-3\">", "</div>" ),
            defineLineTag( "      - ", "<div class=\"paragraph dash-bullet-4\">", "</div>" ),
            defineLineTag( "* ", "<div class=\"paragraph round-bullet-1\">", "</div>" ),
            defineLineTag( "  * ", "<div class=\"paragraph round-bullet-2\">", "</div>" ),
            defineLineTag( "    * ", "<div class=\"paragraph round-bullet-3\">", "</div>" ),
            defineLineTag( "      * ", "<div class=\"paragraph round-bullet-4\">", "</div>" ),
            defineLineTag( "° ", "<div class=\"paragraph hollow-bullet-1\">", "</div>" ),
            defineLineTag( "  ° ", "<div class=\"paragraph hollow-bullet-2\">", "</div>" ),
            defineLineTag( "    ° ", "<div class=\"paragraph hollow-bullet-3\">", "</div>" ),
            defineLineTag( "      ° ", "<div class=\"paragraph hollow-bullet-4\">", "</div>" ),
            defineLineTag( "", "<div class=\"paragraph\">", "</div>" ),
            defineDualTag( "**", "<b>", "</b>" ),
            defineDualTag( "%%", "<i>", "</i>" ),
            defineDualTag( "__", "<u>", "</u>" ),
            defineDualTag( ",,", "<sub>", "</sub>" ),
            defineDualTag( "^^", "<sup>", "</sup>" ),
            defineTag( "~", "&nbsp;" ),
            defineTag( "¦", "<wbr/>" ),
            defineTag( "§", "<br/>" ),
            defineTag( "¶", "<br class=\"linebreak\"/>" ),
            defineTag( "®", "<sup>®</sup>" ),
            defineTag( "™", "<sup>™</sup>" )
        ];
}
