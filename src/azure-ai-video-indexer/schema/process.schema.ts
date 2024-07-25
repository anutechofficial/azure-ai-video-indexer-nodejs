import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as moment from 'moment';
import mongoose, { HydratedDocument, Types } from "mongoose";

export type processDocument = HydratedDocument<Process>

@Schema()
export class Process {
    @Prop({ type: String, default: null })
    video_title: string;

    @Prop({ type: String, default: null })
    video_url: string;

    @Prop({ type: String, default: null })
    video_id: string;

    @Prop({ type: String, default: null })
    state: string;

    @Prop({ type: String, default: null })
    processingProgress: string;

    @Prop({ type: String, default: null })
    accout_id: string;

    @Prop({ type: String, default: null })
    error_string: string;

    @Prop({ default: moment().utc().valueOf() })
    created_at: number;

    @Prop({ default: 0 })
    updated_at: number;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);