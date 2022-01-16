import "./form.css";
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API, Storage } from "aws-amplify";
import config from '../../aws-exports';
const { aws_content_delivery_url: cdn } = config
const Form = () => {
    const [image, setImage] = useState(null);
    const [portfolio, setPortfolio] = useState({ name: "", position: "", bio: "" });

    const loadUserData = async (e) => {
        const data = await API.get("portfolioApi", "/portfolio");
        if (data && data.length) {
            setPortfolio({
                name: data[0].name,
                position: data[0].position,
                bio: data[0].bio
            });
            // const image = await Storage.get(data[0].image, { level: 'public' })
            const image = `${cdn}/public/${data[0].image}`
            setImage(image);
        }

        console.log(data);
    }

    useEffect(() => {
        loadUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!portfolio.name || !portfolio.position || !portfolio.bio) return
            console.log(portfolio);
            await API.post("portfolioApi", "/portfolio", {
                body: portfolio
            });
            // setPortfolio({ name: "", position: "", bio: "" });
        } catch (err) {
            console.log('error creating portfolio:', err)
        }
    }

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const extension = file.name.split(".")[1];
        const key = `${uuidv4()}.${extension}`;
        console.log(key);
        // const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
        try {
            // Upload the file to s3 with public access level. 
            await Storage.put(key, file, {
                level: 'public',
                contentType: file.type
            });
            // Retrieve the uploaded file to display
            const image = await Storage.get(key, { level: 'public' })
            setImage(image);
            setPortfolio({ ...portfolio, image: key });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="admin-wrapper">
            <header className="form-header">
                <p>Create/Update Portfolio</p>
                <AmplifySignOut></AmplifySignOut>
            </header>
            <form className="form-wrapper" onSubmit={handleSubmit}>
                <div className="form-fields">
                    <div className="form-item">
                        <p><label htmlFor="photo">Profile Photo</label></p>
                        <p>
                            {image ? <img className="image-preview" src={image} alt="" /> : <span />}
                            <input
                                type="file"
                                accept="image/png"
                                className="form-input"
                                onChange={(e) => handleImageUpload(e)} />
                        </p>
                    </div>
                    <div className="form-item">
                        <p><label htmlFor="name">Name</label></p>
                        <p><input
                            className="form-input"
                            name="name"
                            type="text"
                            placeholder="Type your name here"
                            value={portfolio.name}
                            onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })}
                            required
                        /></p>
                    </div>
                    <div className="form-item">
                        <p><label htmlFor="position">Position</label></p>
                        <p><input
                            className="form-input"
                            name="position"
                            type="text"
                            placeholder="Type your current position here"
                            value={portfolio.position}
                            onChange={(e) => setPortfolio({ ...portfolio, position: e.target.value })}
                            required
                        /></p>
                    </div>
                    <div className="form-item">
                        <p><label htmlFor="bio">Bio</label></p>
                        <p><textarea
                            className="form-input"
                            name="bio"
                            type="text"
                            rows="8"
                            placeholder="Add your bio here"
                            value={portfolio.bio}
                            onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                            required
                        /></p>
                    </div>
                    <div className="form-item">
                        <button className="btn" type="submit">Save and Publish</button>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default withAuthenticator(Form);