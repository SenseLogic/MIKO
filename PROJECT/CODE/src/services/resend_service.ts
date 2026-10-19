// -- IMPORTS

import { logError } from "senselogic-opus";
import { Resend } from "resend";

// -- TYPES

class ResendService
{
    // -- ATTRIBUTES

    client: Resend | null;
    key: string | undefined;

    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.client = null;
        this.key = process.env.MIKO_PROJECT_RESEND_KEY;
    }

    // -- INQUIRIES

    getClient(
        ) : Resend
    {
        if ( this.client === null )
        {
            this.client = new Resend( this.key ?? "" );
        }

        return this.client;
    }

    // -- OPERATIONS

    async sendMail(
        sender: string,
        recipientArray: string[],
        subject: string,
        emailBody: string
        )
    {
        let { data, error } = await this.getClient()
            .emails
            .send(
                {
                    from: sender,
                    to: recipientArray,
                    subject: subject,
                    html: emailBody
                }
                );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async sendTemplateEmail(
        sender: string,
        recipientArray: string[],
        subject: string,
        emailTemplateBody: unknown
        )
    {
        let { data, error } = await this.getClient()
            .emails
            .send(
                {
                    from: sender,
                    to: recipientArray,
                    subject: subject,
                    react: emailTemplateBody
                }
                );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let resendService = new ResendService();
