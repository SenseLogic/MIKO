// -- IMPORTS

import { logError } from "senselogic-opus";
import Stripe from "stripe";

// -- TYPES

class StripeService
{
    // -- ATTRIBUTES

    client: Stripe | null;
    key: string | undefined;

    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.client = null;
        this.key = process.env.MIKO_PROJECT_STRIPE_KEY;
    }

    // -- INQUIRIES

    getClient(
        ) : Stripe
    {
        if ( this.client === null )
        {
            this.client = new Stripe(
                this.key ?? "",
                {
                    apiVersion: "2026-02-25.clover"
                }
                );
        }

        return this.client;
    }

    // -- OPERATIONS

    async createCheckoutSession(
        lineItemsArray,
        successUrl,
        cancelUrl,
        customerEmail = null,
        metadata = {}
        )
    {
        try
        {
            let sessionParams: Stripe.Checkout.SessionCreateParams =
            {
                mode: "payment",
                line_items: lineItemsArray,
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: metadata
            };

            if ( customerEmail !== null )
            {
                sessionParams.customer_email = customerEmail;
            }

            let session = await this.getClient()
                .checkout
                .sessions
                .create( sessionParams );

            return session;
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }

    // ~~

    async retrieveCheckoutSession(
        sessionId
        )
    {
        try
        {
            let session = await this.getClient()
                .checkout
                .sessions
                .retrieve( sessionId );

            return session;
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }

    // ~~

    async createPaymentIntent(
        amount,
        currency,
        customerId = null,
        metadata = {}
        )
    {
        try
        {
            let paymentIntentParams: Stripe.PaymentIntentCreateParams =
            {
                amount: amount,
                currency: currency,
                metadata: metadata
            };

            if ( customerId !== null )
            {
                paymentIntentParams.customer = customerId;
            }

            let paymentIntent = await this.getClient()
                .paymentIntents
                .create( paymentIntentParams );

            return paymentIntent;
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }

    // ~~

    async retrievePaymentIntent(
        paymentIntentId
        )
    {
        try
        {
            let paymentIntent = await this.getClient()
                .paymentIntents
                .retrieve( paymentIntentId );

            return paymentIntent;
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }

    // ~~

    async createCustomer(
        email,
        name = null,
        metadata = {}
        )
    {
        try
        {
            let customerParams: Stripe.CustomerCreateParams =
            {
                email: email,
                metadata: metadata
            };

            if ( name !== null )
            {
                customerParams.name = name;
            }

            let customer = await this.getClient()
                .customers
                .create( customerParams );

            return customer;
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }

    // ~~

    async retrieveCustomer(
        customerId
        )
    {
        try
        {
            let customer = await this.getClient()
                .customers
                .retrieve( customerId );

            return customer;
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }

    // ~~

    constructWebhookEvent(
        payload,
        signature,
        webhookSecret
        )
    {
        try
        {
            let event = this.getClient()
                .webhooks
                .constructEvent(
                    payload,
                    signature,
                    webhookSecret
                    );

            return event;
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }
}

// -- VARIABLES

export let stripeService = new StripeService();
