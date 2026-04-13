import { generateRobots } from '@vlp/member-ui'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return generateRobots('transcript.taxmonitor.pro')
}
