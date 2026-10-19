// -- IMPORTS

import { getMapById, logError } from "senselogic-opus";
import { supabaseService } from "./supabase_service.ts";

// -- TYPES

class ContactService
{
    // -- ATTRIBUTES

    cachedContactArray: any[] | null;
    cachedContactArrayTimestamp: number;
    cachedContactByIdMap: Record<string, any> | null;

    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedContactArray = null;
        this.cachedContactArrayTimestamp = 0;
        this.cachedContactByIdMap = null;
    }

    // -- INQUIRIES

    inflateContactArray(
        contactArray,
        contactTypeByIdMap
        )
    {
        for ( let contact of contactArray )
        {
            contact.type = contactTypeByIdMap[ contact.typeId ];
        }
    }

    // ~~

    async getContactArray(
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( "CONTACT" )
            .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getContactById(
        contactId
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( "CONTACT" )
            .select()
            .eq( "id", contactId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getContactArrayByMail(
        mail
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( "CONTACT" )
            .select()
            .eq( "mail", mail );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getContactArrayByMailArray(
        mailArray
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( "CONTACT" )
            .select()
            .in( "mail", mailArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedContactArray = null;
        this.cachedContactByIdMap = null;
    }

    // ~~

    async getCachedContactArray(
        )
    {
        if ( this.cachedContactArray === null
             || Date.now() > this.cachedContactArrayTimestamp + 300000 )
        {
            this.cachedContactArray = await this.getContactArray();
            this.cachedContactArrayTimestamp = Date.now();
            this.cachedContactByIdMap = null;
        }

        return this.cachedContactArray;
    }

    // ~~

    async getCachedContactByIdMap(
        )
    {
        if ( this.cachedContactByIdMap === null
             || Date.now() > this.cachedContactArrayTimestamp + 300000 )
        {
            this.cachedContactByIdMap = getMapById(
                await this.getCachedContactArray()
                );
        }

        return this.cachedContactByIdMap;
    }

    // ~~

    async addContact(
        contact
        )
    {
        this.clearCache();

        let { data, error } = await supabaseService.getClient()
            .from( "CONTACT" )
            .insert( contact );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setContactById(
        contact,
        contactId
        )
    {
        this.clearCache();

        let { data, error } = await supabaseService.getClient()
            .from( "CONTACT" )
            .update( contact )
            .eq( "id", contactId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeContactById(
        contactId
        )
    {
        this.clearCache();

        let { data, error } = await supabaseService.getClient()
            .from( "CONTACT" )
            .delete()
            .eq( "id", contactId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let contactService = new ContactService();
