import CompactDark from '../../assets/previews/previewDark/Kompakt-dark.svg'
import ChronoDark from '../../assets/previews/previewDark/Kronologisk-dark.svg'
import TimelineDark from '../../assets/previews/previewDark/Tidslinje-dark.svg'
import BusStopDark from '../../assets/previews/previewDark/Holdeplass-dark.svg'
import CompactLight from '../../assets/previews/previewLight/Kompakt-light.svg'
import ChronoLight from '../../assets/previews/previewLight/Kronologisk-light.svg'
import TimelineLight from '../../assets/previews/previewLight/Tidslinje-light.svg'
import BusStopLight from '../../assets/previews/previewLight/Holdeplass-light.svg'
import CompactDefault from '../../assets/previews/previewDefault/Kompakt-blue.svg'
import ChronoDefault from '../../assets/previews/previewDefault/Kronologisk-blue.svg'
import TimelineDefault from '../../assets/previews/previewDefault/Tidslinje-blue.svg'
import BusStopDefault from '../../assets/previews/previewDefault/Holdeplass-blue.svg'
import CompactGrey from '../../assets/previews/previewGrey/Kompakt-grey.svg'
import ChronoGrey from '../../assets/previews/previewGrey/Kronologisk-grey.svg'
import TimelineGrey from '../../assets/previews/previewGrey/Tidslinje-grey.svg'
import BusStopGrey from '../../assets/previews/previewGrey/Holdeplass-gray.svg'

import { Theme } from '../../types'

export function ThemeDashbboardPreview(
    theme: Theme | undefined,
): { [key: string]: any } {
    switch (theme) {
        case Theme.DARK:
            return {
                Timeline: TimelineDark,
                Chrono: ChronoDark,
                Compact: CompactDark,
                BusStop: BusStopDark,
            }
        case Theme.GREY:
            return {
                Timeline: TimelineGrey,
                Chrono: ChronoGrey,
                Compact: CompactGrey,
                BusStop: BusStopGrey,
            }
        case Theme.LIGHT:
            return {
                Timeline: TimelineLight,
                Chrono: ChronoLight,
                Compact: CompactLight,
                BusStop: BusStopLight,
            }
        default:
            return {
                Timeline: TimelineDefault,
                Chrono: ChronoDefault,
                Compact: CompactDefault,
                BusStop: BusStopDefault,
            }
    }
}
