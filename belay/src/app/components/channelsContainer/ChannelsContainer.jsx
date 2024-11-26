"use client"
import { UserContext } from '@/app/contexts/UserContext'
import { useRouter } from 'next/router'
import { useChannelsRequests } from '@/app/hooks/useChannelsRequests'
import React, { useState, useEffect, useContext } from 'react'
function ChannelsContainer() {
    // const {getChannels} = useChannelsRequests()
    const {getChannels, currentChannel, setCurrentChannel} = useContext(UserContext)
    const [channels, setChannels] = useState([])
    const router = useRouter()
    const { id } = router.query  // Get the channel ID from the URL
    useEffect(() => {
        const attemptToGetChannels = async () => {
            const channelsResponse = await getChannels()
            console.log(channelsResponse)
            if (channelsResponse){
                if(id){
                    // TODO: check if the channel is in the list of channels
                    if(channelsResponse.contains(id)){
                        setCurrentChannel(id)
                    }else{
                        setCurrentChannel(null)
                    }
                }
                setChannels(channelsResponse)
            }
        }
        attemptToGetChannels()
    }, [])

    const handleChannelClick = (channelId) => {
        setCurrentChannel(channelId)
        router.push(`/channels/${channelId}`)
    }

    return (
        <div className="channels-container">
            <h2 key={-1}>Channels</h2>
            {channels && channels.map(channel => {
                return (
                    <div key={channel.channel_id} className={`channel-name ${channel.channel_id == currentChannel ? "selected" : ""}`} 
                        onClick={() =>  handleChannelClick(channel.channel_id)}>
                        # {channel.channel_name} [{channel.unread_count}]
                    </div>
                )
            })}
        </div>
    )
}

export default ChannelsContainer