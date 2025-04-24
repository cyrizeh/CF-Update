export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get data from both query and body
    const { first_name, last_name, email, has_specimens, has_partner, phone_number, ref } = {
        ...req.query,
        ...req.body,
    };

    const parsedPhoneNumber = phone_number !== undefined ?
        phone_number : req.body['phone_number[full]'] || undefined;

    var key = ref.toLowerCase().trim();
    const queryParams = new URLSearchParams({ first_name, last_name, email, has_specimens, has_partner, phone_number: parsedPhoneNumber, ref: key }).toString();

    res.writeHead(302, { Location: `/signup?${queryParams}` });
    return res.end();
}