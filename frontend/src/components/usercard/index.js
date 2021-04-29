import './styles/style.css'
import avatar from '../../images/avatars/profile-picture.png'

const UserCard = () => {
    return (
        <div className="user-card">
            <img className="avatar" src={avatar} alt="avatar"/>
            <p>Wins: 203 Loses: 34</p>
            {/*todo percentage bar*/}
            {/*? username*/}
            {/*ranking #1*/}
        </div>
    )
}

export default UserCard