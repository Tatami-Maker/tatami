import mongoose from 'mongoose'

export interface Tokens extends mongoose.Document {
  mint: string
  allstar: boolean
  airdropTokens: bigint
  allstarTokens: bigint
  recipients: string[]
  recipientsTokens: bigint[] 
}

const TokenSchema = new mongoose.Schema<Tokens>({
  mint: {
    type: String,
    required: true,
    unique: true
  },
  allstar: {
    type: Boolean,
    required: true
  },
  airdropTokens: {
    type: BigInt,
  },
  allstarTokens: {
    type: BigInt,
  },
  recipients: {
    type: [String]
  },
  recipientsTokens: {
    type: [BigInt]
  }
})

export default mongoose.models.Token || mongoose.model<Tokens>('Token', TokenSchema)