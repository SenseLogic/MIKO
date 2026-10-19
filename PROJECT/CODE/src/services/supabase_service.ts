// -- IMPORTS

import { parse, serialize } from "cookie";
import { logError } from "senselogic-opus";
import { createServerClient } from "@supabase/ssr";
import { readFile } from "node:fs/promises";

// -- TYPES

class SupabaseService
{
    // -- ATTRIBUTES

    anonymousClient: ReturnType<typeof createServerClient> | null;
    databaseKey: string | undefined;
    databaseUrl: string | undefined;
    storageName: string | undefined;
    storageUrl: string | undefined;

    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.anonymousClient = null;
        this.databaseKey = process.env.MIKO_PROJECT_SUPABASE_DATABASE_KEY;
        this.databaseUrl = process.env.MIKO_PROJECT_SUPABASE_DATABASE_URL;
        this.storageName = process.env.MIKO_PROJECT_SUPABASE_STORAGE_NAME;
        this.storageUrl = process.env.MIKO_PROJECT_SUPABASE_STORAGE_URL;
    }

    // -- INQUIRIES

    getFileUrl(
        filePath: string
        ) : string
    {
        return ( this.storageUrl ?? "" ) + "/" + filePath;
    }

    // -- OPERATIONS

    getAnonymousClient(
        )
    {
        if ( this.anonymousClient === null )
        {
            this.anonymousClient = createServerClient(
                this.databaseUrl ?? "",
                this.databaseKey ?? "",
                {
                    cookies:
                    {
                        getAll: () => [],
                        setAll: () => {}
                    }
                }
                );
        }

        return this.anonymousClient;
    }

    // ~~

    getAuthenticatedClient(
        request: Request | null,
        responseHeaders: Headers | null
        )
    {
        return (
            createServerClient(
                this.databaseUrl ?? "",
                this.databaseKey ?? "",
                {
                    cookies:
                    {
                        getAll: () =>
                        {
                            if ( request )
                            {
                                let cookieHeader = request.headers.get( "cookie" ) ?? "";
                                let parsedCookieMap = parse( cookieHeader );

                                return Object.entries( parsedCookieMap ).map(
                                    ( [ name, value ] ) =>
                                    (
                                        {
                                            name,
                                            value: value ?? ""
                                        }
                                        )
                                    );
                            }
                            else
                            {
                                return [];
                            }
                        },
                        setAll: (
                            cookieArrayToSet
                            ) =>
                        {
                            if ( responseHeaders )
                            {
                                for ( let cookieItem of cookieArrayToSet )
                                {
                                    let cookieOptions = cookieItem.options ?? {};

                                    responseHeaders.append(
                                        "Set-Cookie",
                                        serialize(
                                            cookieItem.name,
                                            cookieItem.value,
                                            {
                                                path: cookieOptions.path ?? "/",
                                                domain: cookieOptions.domain,
                                                secure: cookieOptions.secure ?? false,
                                                httpOnly: cookieOptions.httpOnly ?? true,
                                                sameSite:
                                                    ( cookieOptions.sameSite as
                                                        | "lax"
                                                        | "strict"
                                                        | "none"
                                                        | undefined ) ?? "lax",
                                                maxAge: cookieOptions.maxAge,
                                                expires: cookieOptions.expires
                                            }
                                            )
                                        );
                                }
                            }
                        }
                    }
                }
                )
            );
    }

    // ~~

    getClient(
        request: Request | null = null,
        responseHeaders: Headers | null = null
        )
    {
        if ( request || responseHeaders )
        {
            return this.getAuthenticatedClient( request, responseHeaders );
        }
        else
        {
            return this.getAnonymousClient();
        }
    }

    // ~~

    async uploadFile(
        localFile: string | Uint8Array,
        storageFilePath: string,
        storageFileIsOverwritten = false
        )
    {
        let { data, error } = await this.getClient( null, null )
            .storage
            .from( this.storageName ?? "" )
            .upload(
                storageFilePath,
                localFile,
                {
                    cacheControl: "3600",
                    upsert: storageFileIsOverwritten
                }
                );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async copyFile(
        localFile: string | Uint8Array,
        storageFilePath: string,
        storageFileIsOverwritten = false
        )
    {
        let fileData: Uint8Array;

        if ( typeof localFile === "string" )
        {
            fileData = await readFile( localFile );
        }
        else
        {
            fileData = localFile;
        }

        return await this.uploadFile(
            fileData,
            storageFilePath,
            storageFileIsOverwritten
            );
    }

    // ~~

    async removeFile(
        storageFilePath: string
        )
    {
        let { data, error } = await this.getClient( null, null )
            .storage
            .from( this.storageName ?? "" )
            .remove( [ storageFilePath ] );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async signUpUser(
        email: string,
        password: string,
        request: Request | null = null,
        responseHeaders: Headers | null = null
        )
    {
        let { data, error } = await this.getClient( request, responseHeaders ).auth
            .signUp(
                {
                    email,
                    password
                }
                );

        if ( error !== null )
        {
            logError( error );
        }

        return data.user;
    }

    // ~~

    async signInUser(
        email: string,
        password: string,
        request: Request | null = null,
        responseHeaders: Headers | null = null
        )
    {
        let { data, error } = await this.getClient( request, responseHeaders ).auth
            .signInWithPassword(
                {
                    email,
                    password
                }
                );

        if ( error !== null )
        {
            logError( error );
        }

        return data?.user ?? null;
    }

    // ~~

    async signOutUser(
        request: Request | null = null,
        responseHeaders: Headers | null = null
        )
    {
        let { error } = await this.getClient( request, responseHeaders ).auth
            .signOut();

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let supabaseService = new SupabaseService();
