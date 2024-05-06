import { select, getModuleOptions, on } from 'lib/dom'

const MODULE_NAME = 'google-autocomplete'
const google = window.google || {}

const countriesMap = {
  Afghanistan: 'AF',
  'Aland Islands': 'AX',
  Albania: 'AL',
  Algeria: 'DZ',
  'American Samoa': 'AS',
  Andorra: 'AD',
  Angola: 'AO',
  Anguilla: 'AI',
  Antarctica: 'AQ',
  'Antigua And Barbuda': 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Aruba: 'AW',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bermuda: 'BM',
  Bhutan: 'BT',
  Bolivia: 'BO',
  'Bosnia And Herzegovina': 'BA',
  Botswana: 'BW',
  'Bouvet Island': 'BV',
  Brazil: 'BR',
  'British Indian Ocean Territory': 'IO',
  'Brunei Darussalam': 'BN',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  'Cape Verde': 'CV',
  'Cayman Islands': 'KY',
  'Central African Republic': 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  'Christmas Island': 'CX',
  'Cocos (Keeling) Islands': 'CC',
  Colombia: 'CO',
  Comoros: 'KM',
  Congo: 'CG',
  'Congo, Democratic Republic': 'CD',
  'Cook Islands': 'CK',
  'Costa Rica': 'CR',
  'Cote D\'Ivoire': 'CI',
  Croatia: 'HR',
  Cuba: 'CU',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Ethiopia: 'ET',
  'Falkland Islands (Malvinas)': 'FK',
  'Faroe Islands': 'FO',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  'French Guiana': 'GF',
  'French Polynesia': 'PF',
  'French Southern Territories': 'TF',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Gibraltar: 'GI',
  Greece: 'GR',
  Greenland: 'GL',
  Grenada: 'GD',
  Guadeloupe: 'GP',
  Guam: 'GU',
  Guatemala: 'GT',
  Guernsey: 'GG',
  Guinea: 'GN',
  'Guinea-Bissau': 'GW',
  Guyana: 'GY',
  Haiti: 'HT',
  'Heard Island & Mcdonald Islands': 'HM',
  'Holy See (Vatican City State)': 'VA',
  Honduras: 'HN',
  'Hong Kong': 'HK',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  'Iran, Islamic Republic Of': 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  'Isle Of Man': 'IM',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jersey: 'JE',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  Korea: 'KR',
  Kuwait: 'KW',
  Kyrgyzstan: 'KG',
  'Lao People\'s Democratic Republic': 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  'Libyan Arab Jamahiriya': 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Macao: 'MO',
  Macedonia: 'MK',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  'Marshall Islands': 'MH',
  Martinique: 'MQ',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mayotte: 'YT',
  Mexico: 'MX',
  'Micronesia, Federated States Of': 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Montserrat: 'MS',
  Morocco: 'MA',
  Mozambique: 'MZ',
  Myanmar: 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  'Netherlands Antilles': 'AN',
  'New Caledonia': 'NC',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  Niue: 'NU',
  'Norfolk Island': 'NF',
  'Northern Mariana Islands': 'MP',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  'Palestinian Territory, Occupied': 'PS',
  Panama: 'PA',
  'Papua New Guinea': 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Pitcairn: 'PN',
  Poland: 'PL',
  Portugal: 'PT',
  'Puerto Rico': 'PR',
  Qatar: 'QA',
  Reunion: 'RE',
  Romania: 'RO',
  'Russian Federation': 'RU',
  Rwanda: 'RW',
  'Saint Barthelemy': 'BL',
  'Saint Helena': 'SH',
  'Saint Kitts And Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Martin': 'MF',
  'Saint Pierre And Miquelon': 'PM',
  'Saint Vincent And Grenadines': 'VC',
  Samoa: 'WS',
  'San Marino': 'SM',
  'Sao Tome And Principe': 'ST',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  'Sierra Leone': 'SL',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'Solomon Islands': 'SB',
  Somalia: 'SO',
  'South Africa': 'ZA',
  'South Georgia And Sandwich Isl.': 'GS',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  'Svalbard And Jan Mayen': 'SJ',
  Swaziland: 'SZ',
  Sweden: 'SE',
  Switzerland: 'CH',
  'Syrian Arab Republic': 'SY',
  Taiwan: 'TW',
  Tajikistan: 'TJ',
  Tanzania: 'TZ',
  Thailand: 'TH',
  'Timor-Leste': 'TL',
  Togo: 'TG',
  Tokelau: 'TK',
  Tonga: 'TO',
  'Trinidad And Tobago': 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  'Turks And Caicos Islands': 'TC',
  Tuvalu: 'TV',
  Uganda: 'UG',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  'United States Outlying Islands': 'UM',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  Venezuela: 'VE',
  'Viet Nam': 'VN',
  'Virgin Islands, British': 'VG',
  'Virgin Islands, U.S.': 'VI',
  'Wallis And Futuna': 'WF',
  'Western Sahara': 'EH',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW'
}

const getCountryCodeByName = (countryName) => {
  if (Object.prototype.hasOwnProperty.call(countriesMap, countryName)) {
    return countriesMap[countryName]
  } else {
    return countryName
  }
}

export default (el) => {
  const defaults = {
    streetNumberSelector: '#AddressStreetNumberNew',
    routeSelector: '#AddressRouteNew',
    fullAddressSelector: '#Address1New',
    localitySelector: '#AddressCityNew',
    neighborhoodSelector: '#AddressCityNew',
    administrativeAreaLevel1Selector: '#AddressProvinceNew',
    countrySelector: '#AddressCountryNew',
    postalCodeSelector: '#AddressZipNew',
    countryCode: 'AU'
  }

  const options = getModuleOptions(MODULE_NAME, el, defaults)

  const lookup = {
    streetNumberEl: select(options.streetNumberSelector, el),
    routeEl: select(options.routeSelector, el),
    fullAddressEl: select(options.fullAddressSelector, el),
    localityEl: select(options.localitySelector, el),
    neighborhoodEl: select(options.neighborhoodSelector, el),
    administrativeAreaLevel1El: select(options.administrativeAreaLevel1Selector, el),
    countryEl: select(options.countrySelector, el),
    postalCodeEl: select(options.postalCodeSelector, el)
  }

  const autocomplete = new google.maps.places.Autocomplete(lookup.fullAddressEl, {
    types: ['geocode']
  })

  const restrictSearchByCountry = () => {
    if (lookup.countryEl) {
      const country = lookup.countryEl.value
      options.countryCode = getCountryCodeByName(country)
      if (country) {
        autocomplete.setComponentRestrictions({ country: options.countryCode })
      }
    }
  }

  const onChangeCountry = () => {
    if (lookup.countryEl) {
      on('change', restrictSearchByCountry, lookup.countryEl)
    }
  }

  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    neighborhood: 'long_name',
    postal_code: 'short_name'
  }

  const geolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        const circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        })
        autocomplete.setBounds(circle.getBounds())
      })
    }
  }

  const fillInAddress = () => {
    const place = autocomplete.getPlace()
    for (const component of Object.keys(componentForm)) {
      if (lookup[component]) {
        lookup[component].value = ''
      }
    }
    let fullAddress = ''
    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0]
      const val = place.address_components[i][componentForm[addressType]]
      if (componentForm[addressType]) {
        switch (addressType) {
          case 'street_number':
            fullAddress = val + fullAddress
            break
          case 'route':
            fullAddress = fullAddress + ' '
            fullAddress = fullAddress + val
            break
          case 'neighborhood':
            if (lookup.neighborhoodEl && val) {
              lookup.neighborhoodEl.value = val
            }
            break
          case 'locality':
            if (lookup.localityEl && val) {
              lookup.localityEl.value = val
            }
            break
          case 'administrative_area_level_1':
            if (lookup.administrativeAreaLevel1El && val) {
              lookup.administrativeAreaLevel1El.value = val
            }
            break
          case 'country':
            if (lookup.countryEl && val) {
              lookup.countryEl.value = val
            }
            break
          case 'postal_code':
            if (lookup.postalCodeEl && val) {
              lookup.postalCodeEl.value = val
            }
            break
        }
      }
    }
    if (fullAddress && lookup.fullAddressEl) {
      lookup.fullAddressEl.value = fullAddress
    }
  }

  if (lookup.fullAddressEl) {
    on('focus', geolocate(), lookup.fullAddressEl)
    autocomplete.addListener('place_changed', fillInAddress)
    restrictSearchByCountry()
    onChangeCountry()
  }
}
