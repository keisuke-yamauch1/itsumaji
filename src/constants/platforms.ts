export const PLATFORM_IDS = {
    LISTEN: 1,
    SPOTIFY: 2,
    APPLE_PODCASTS: 3,
    AMAZON_MUSIC: 4,
} as const

export const PLATFORM_INFO: Record<number, { name: string; icon_url: string }> = {
    1: { name: 'LISTEN',         icon_url: 'https://listen.style/images/LISTEN_logo.svg' },
    2: { name: 'Spotify',        icon_url: 'https://images.kechiiiiin.com/itsumaji/20260329092716.svg' },
    3: { name: 'Apple Podcasts', icon_url: 'https://images.kechiiiiin.com/itsumaji/20260329092433.png' },
    4: { name: 'Amazon Music',   icon_url: 'https://images.kechiiiiin.com/itsumaji/20260329092942.svg' },
}