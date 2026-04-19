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
        },
        url: "https://listen.style/p/itsumaji-radio/tstkdxyx",
      }
    ])
  })

  it('正常系：複数の item を配列として返す', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>いつまじラジオ</title>
    <item>
      <title><![CDATA[エピソード1]]></title>
      <description><![CDATA[説明1]]></description>
      <link>https://listen.style/p/itsumaji-radio/ep1</link>
      <guid isPermaLink="false">guid-1</guid>
      <pubDate>Sat, 18 Apr 2026 23:08:46 +0000</pubDate>
      <itunes:duration>00:10:00</itunes:duration>
      <itunes:image href="https://example.com/image1.jpg"/>
    </item>
    <item>
      <title><![CDATA[エピソード2]]></title>
      <description><![CDATA[説明2]]></description>
      <link>https://listen.style/p/itsumaji-radio/ep2</link>
      <guid isPermaLink="false">guid-2</guid>
      <pubDate>Sat, 11 Apr 2026 23:08:46 +0000</pubDate>
      <itunes:duration>00:20:00</itunes:duration>
      <itunes:image href="https://example.com/image2.jpg"/>
    </item>
  </channel>
</rss>`

    const results = parseRss(xml)
    expect(results).toHaveLength(2)
    expect(results[0].episode.guid).toBe('guid-1')
    expect(results[0].episode.title).toBe('エピソード1')
    expect(results[1].episode.guid).toBe('guid-2')
    expect(results[1].episode.title).toBe('エピソード2')
  })

  it('正常系：item が 0 件の場合は空配列を返す', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>いつまじラジオ</title>
  </channel>
</rss>`

    const results = parseRss(xml)
    expect(results).toEqual([])
  })

  it('正常系：CDATA なしの title/description もパースできる', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>いつまじラジオ</title>
    <item>
      <title>プレーンなタイトル</title>
      <description>プレーンな説明</description>
      <link>https://listen.style/p/itsumaji-radio/plain</link>
      <guid isPermaLink="false">plain-guid</guid>
      <pubDate>Sat, 18 Apr 2026 23:08:46 +0000</pubDate>
      <itunes:duration>00:05:00</itunes:duration>
      <itunes:image href="https://example.com/plain.jpg"/>
    </item>
  </channel>
</rss>`

    const results = parseRss(xml)
    expect(results[0].episode.title).toBe('プレーンなタイトル')
    expect(results[0].episode.description).toBe('プレーンな説明')
  })
})