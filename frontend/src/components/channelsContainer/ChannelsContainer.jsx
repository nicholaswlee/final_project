import { UserContext } from '../../contexts/UserContext'
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
function ChannelsContainer() {
    // const {getChannels} = useChannelsRequests()
    const {getChannels, currentChannel, setCurrentChannel} = useContext(UserContext)
    const [channels, setChannels] = useState([])
    const { pathname } = useLocation()
    const navigate = useNavigate();  // React Router v6
    useEffect(() => {
        const attemptToGetChannels = async () => {
            const channelsResponse = await getChannels()
            let path_items = pathname.split("/")
            let id = (path_items.length > 2 && path_items[1] == "channels") ? path_items[2] : null
            if (channelsResponse){
                if(id && channelsResponse.find(channel => channel.channel_id == id)){
                    setCurrentChannel(id)
                }else{
                    setCurrentChannel(null)
                }
                setChannels(channelsResponse)
            }
        }
        attemptToGetChannels()
    }, [pathname])

    const handleChannelClick = (channelId) => {
        setCurrentChannel(channelId)
        if(pathname !== `/channels/${channelId}`){
            navigate(`/channels/${channelId}`);
        }
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