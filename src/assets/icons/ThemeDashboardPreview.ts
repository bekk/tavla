import CompactDark from '../previews/previewDark/Kompakt-dark.svg'
import ChronoDark from '../previews/previewDark/Kronologisk-dark.svg'
import TimelineDark from '../previews/previewDark/Tidslinje-dark.svg'
import MapDark from '../previews/previewDark/Kart-dark.svg'
import CompactLight from '../previews/previewLight/Kompakt-light.svg'
import ChronoLight from '../previews/previewLight/Kronologisk-light.svg'
import TimelineLight from '../previews/previewLight/Tidslinje-light.svg'
import MapLight from '../previews/previewLight/Kart-light.svg'
import CompactDefault from '../previews/previewDefault/Kompakt-blue.svg'
import ChronoDefault from '../previews/previewDefault/Kronologisk-blue.svg'
import TimelineDefault from '../previews/previewDefault/Tidslinje-blue.svg'
import MapDefault from '../previews/previewDefault/Kart-blue.svg'
import CompactGrey from '../previews/previewGrey/Kompakt-grey.svg'
import ChronoGrey from '../previews/previewGrey/Kronologisk-grey.svg'
import TimelineGrey from '../previews/previewGrey/Tidslinje-grey.svg'
import MapGrey from '../previews/previewGrey/Kart-grey.svg'

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
                Map: MapDark,
            }
        case Theme.GREY:
            return {
                Timeline: TimelineGrey,
                Chrono: ChronoGrey,
                Compact: CompactGrey,
                Map: MapGrey,
            }
        case Theme.LIGHT:
            return {
                Timeline: TimelineLight,
                Chrono: ChronoLight,
                Compact: CompactLight,
                Map: MapLight,
            }
        default:
            return {
                Timeline: TimelineDefault,
                Chrono: ChronoDefault,
                Compact: CompactDefault,
                Map: MapDefault,
            }
    }
}
