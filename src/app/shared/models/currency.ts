export interface Currency {
    countryId: number
    currency: string
    currencyCode: string
    currencyId: number
    imageUrl: string
    symbol: string
    isDefault?: number

}

export interface CountryCode {
    callingCode: string
    countryCode: string
    countryId: number
    imageUrl: string
    name: string
}