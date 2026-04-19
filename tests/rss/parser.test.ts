import { describe, it, expect } from 'vitest'
import { parseRss } from '../../src/rss/parser'

describe('parseRss', () => {
  it('正常系：xmlの中身をEpisode型に変換できること', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>いつまじラジオ</title>
    <item>
      <title><![CDATA[雑談：最近ハマってること #11]]></title>
      <description><![CDATA[説明テキスト]]></description>
      <link>https://listen.style/p/itsumaji-radio/tstkdxyx</link>
      <guid isPermaLink="false">01kpf8d7sgm2q6byyxf2q2r6ap</guid>
      <pubDate>Sat, 18 Apr 2026 23:08:46 +0000</pubDate>
      <itunes:duration>00:53:51</itunes:duration>
      <itunes:image href="https://example.com/image.jpg"/>
    </item>
  </channel>
</rss>`

    const results = parseRss(xml)
    expect(results).toEqual([
      {
        episode: {
          guid: "01kpf8d7sgm2q6byyxf2q2r6ap",
          title: "雑談：最近ハマってること #11",
          description: "説明テキスト",
          published_at: "Sat, 18 Apr 2026 23:08:46 +0000",
          duration: "00:53:51",
          thumbnail_url: "https://example.com/image.jpg",
          url: "https://listen.style/p/itsumaji-radio/tstkdxyx",
        },
        platforms: [
          { name: "Listen Style", icon_url: "https://listen.style/favicon.ico", url: "https://listen.style/p/itsumaji-radio/tstkdxyx" }
        ]
      }
    ])
  })
})